import numpy as np
import cv2
import os

# Ensure the output directory exists
output_dir = "./cropped"
os.makedirs(output_dir, exist_ok=True)

# Load images and convert to grayscale
image1 = cv2.imread('./images/r_edited_r_edited_r_edited_r_edited_image_2469970626_2492014085_1934990478_1952977494.png')
image2 = cv2.resize(cv2.imread('./images/image.jpg'), (image1.shape[1], image1.shape[0]))  # Ensure same size
gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

# Calculate the absolute difference
diff = cv2.absdiff(gray1, gray2)

# Threshold the difference to get a binary image
_, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

# Find contours of the changes
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Identify the largest contour by area
largest_contour = max(contours, key=cv2.contourArea)

# Get the center and radius of the minimum enclosing circle of the largest contour
(x, y), radius = cv2.minEnclosingCircle(largest_contour)
center = (int(x), int(y))
enlarged_radius = int(radius * 1.5)  # Increase radius for more white background around the circle

# Define padding to add some extra space around the circle
padding = 20

# Calculate the bounding box for cropping, ensuring it stays within image bounds
x_min = max(0, center[0] - enlarged_radius - padding)
x_max = min(image1.shape[1], center[0] + enlarged_radius + padding)
y_min = max(0, center[1] - enlarged_radius - padding)
y_max = min(image1.shape[0], center[1] + enlarged_radius + padding)

# Create a white background for the cropped area
cropped_image = np.ones((y_max - y_min, x_max - x_min, 3), dtype=np.uint8) * 255

# Draw the circle on the white background
cv2.circle(cropped_image, (center[0] - x_min, center[1] - y_min), enlarged_radius, (0, 0, 0), -1)

# Mask for keeping the area inside the circle
mask = np.zeros_like(image1, dtype=np.uint8)
cv2.circle(mask, center, enlarged_radius, (255, 255, 255), -1)

# Place the content inside the circle from the original image onto the white background
cropped_image = np.where(mask[y_min:y_max, x_min:x_max] == 255, image1[y_min:y_max, x_min:x_max], cropped_image)

# Save the cropped image
output_path = os.path.join(output_dir, "cropped_image.jpg")
cv2.imwrite(output_path, cropped_image)
