import cv2
import numpy as np

# Load the two images
image1 = cv2.imread("./images/image.jpg")
image2 = cv2.imread("./images/r_edited_image_3115944379.png")

# Convert images to grayscale
gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

# Compute the absolute difference between the images
diff = cv2.absdiff(gray1, gray2)

# Apply a binary threshold to the difference image
_, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

# Find contours of the thresholded image
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Create a mask for the differing region (inside the contour)
mask = np.zeros_like(gray1)
cv2.drawContours(mask, contours, -1, 255, thickness=cv2.FILLED)

# Smooth the edges of the mask using Gaussian blur
blurred_mask = cv2.GaussianBlur(mask, (21, 21), 0)

# Create the inverse mask to identify the outer area
inverse_mask = cv2.bitwise_not(blurred_mask)

# Darken the area outside the original smoothed contour in the original image
darkened_image = image1.copy()
darkened_image[inverse_mask == 255] = (darkened_image[inverse_mask == 255] * 0.2).astype(np.uint8)

# Calculate the bounding box for the contours and expand by 100 pixels
x, y, w, h = cv2.boundingRect(np.vstack(contours))  # Bounding box around all contours
x = max(0, x - 100)
y = max(0, y - 100)
w = min(image1.shape[1] - x, w + 200)  # Ensure within image bounds
h = min(image1.shape[0] - y, h + 200)

# Crop the image using the expanded bounding box
cropped_image = darkened_image[y:y+h, x:x+w]

# Save or display the final cropped image
cv2.imwrite("./cropped/cropped_changed_area_with_margin.jpg", cropped_image)
# To display the image, uncomment the line below
# cv2.imshow("Cropped Changed Area with Margin", cropped_image)
# cv2.waitKey(0)

# Clean up and close windows if displaying
cv2.destroyAllWindows()
