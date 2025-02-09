import torch
import torch.nn as nn
import torchvision
import torch.optim
import os
import argparse
import dataloader
import model
import Myloss


def weights_init(m):
    classname = m.__class__.__name__
    if classname.find('Conv') != -1:
        m.weight.data.normal_(0.0, 0.02)
    elif classname.find('BatchNorm') != -1:
        m.weight.data.normal_(1.0, 0.02)
        m.bias.data.fill_(0)


def train(config):
    # Set device to CPU explicitly
    device = torch.device('cpu')
    print(f"Using device: {device}")

    # Initialize the model and move it to the device
    DCE_net = model.enhance_net_nopool().to(device)

    # Initialize weights
    DCE_net.apply(weights_init)

    if config.load_pretrain:
        DCE_net.load_state_dict(torch.load(config.pretrain_dir, map_location=device))

    # Load dataset
    train_dataset = dataloader.lowlight_loader(config.lowlight_images_path)
    train_loader = torch.utils.data.DataLoader(
        train_dataset,
        batch_size=config.train_batch_size,
        shuffle=True,
        num_workers=config.num_workers
    )

    # Loss functions
    L_color = Myloss.L_color()
    L_spa = Myloss.L_spa()
    L_exp = Myloss.L_exp(16, 0.6)
    L_TV = Myloss.L_TV()

    # Optimizer
    optimizer = torch.optim.Adam(DCE_net.parameters(), lr=config.lr, weight_decay=config.weight_decay)

    # Training loop
    DCE_net.train()
    for epoch in range(config.num_epochs):
        print(f"Starting Epoch {epoch + 1}/{config.num_epochs}")
        for iteration, img_lowlight in enumerate(train_loader):
            # Move data to device
            img_lowlight = img_lowlight.to(device)

            # Forward pass
            enhanced_image_1, enhanced_image, A = DCE_net(img_lowlight)

            # Compute losses
            Loss_TV = 200 * L_TV(A)
            loss_spa = torch.mean(L_spa(enhanced_image, img_lowlight))
            loss_col = 5 * torch.mean(L_color(enhanced_image))
            loss_exp = 10 * torch.mean(L_exp(enhanced_image))

            # Total loss
            loss = Loss_TV + loss_spa + loss_col + loss_exp

            # Backpropagation
            optimizer.zero_grad()
            loss.backward()
            torch.nn.utils.clip_grad_norm_(DCE_net.parameters(), config.grad_clip_norm)
            optimizer.step()

            # Print loss every few iterations
            if (iteration + 1) % config.display_iter == 0:
                print(f"Epoch [{epoch + 1}/{config.num_epochs}], Iteration [{iteration + 1}/{len(train_loader)}], Loss: {loss.item():.4f}")

        # Save model at the end of each epoch
        epoch_snapshot_path = os.path.join(config.snapshots_folder, f"Epoch{epoch + 1}.pth")
        torch.save(DCE_net.state_dict(), epoch_snapshot_path)
        print(f"Model saved at: {epoch_snapshot_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()

    # Input Parameters
    parser.add_argument('--lowlight_images_path', type=str, default="data/train_data/")
    parser.add_argument('--lr', type=float, default=0.001)
    parser.add_argument('--weight_decay', type=float, default=0.001)
    parser.add_argument('--grad_clip_norm', type=float, default=0.1)
    parser.add_argument('--num_epochs', type=int, default=50)  # Reduced epochs
    parser.add_argument('--train_batch_size', type=int, default=4)  # Reduced batch size
    parser.add_argument('--num_workers', type=int, default=4)  # Single-threaded data loading
    parser.add_argument('--display_iter', type=int, default=20)  # Less frequent display
    parser.add_argument('--snapshots_folder', type=str, default="snapshots/")
    parser.add_argument('--load_pretrain', type=bool, default=False)
    parser.add_argument('--pretrain_dir', type=str, default="snapshots/Epoch99.pth")

    config = parser.parse_args()

    # Create snapshots folder if it doesn't exist
    if not os.path.exists(config.snapshots_folder):
        os.makedirs(config.snapshots_folder)

    train(config)
