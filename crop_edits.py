import cv2
import os
import numpy as np

CROPPED_FOLDER = "./cropped"
os.makedirs(CROPPED_FOLDER, exist_ok=True)

# Load the two images
image2 = cv2.imread("./images/r_edited_r_edited_r_edited_r_edited_r_edited_r_edited_r_edited_r_edited_image_3110726969_255991874_2997835253_3058331123_760496478_130496237_1288699302_3896622530.png")
image1 = cv2.imread("./images/r_edited_r_edited_r_edited_r_edited_r_edited_r_edited_image_3110726969_255991874_2997835253_3058331123_760496478_130496237.png")

# Convert images to grayscale
gray1 = cv2.cvtColor(image1, cv2.COLOR_BGR2GRAY)
gray2 = cv2.cvtColor(image2, cv2.COLOR_BGR2GRAY)

# Compute the absolute difference between the images
diff = cv2.absdiff(gray1, gray2)

# Apply a binary threshold to the difference image
_, thresh = cv2.threshold(diff, 30, 255, cv2.THRESH_BINARY)

# Find contours of the thresholded image
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Calculate the bounding box for the contours and expand by 100 pixels
if contours:
    x, y, w, h = cv2.boundingRect(np.vstack(contours))  # Bounding box around all contours
    x = max(0, x - 100)
    y = max(0, y - 100)
    w = min(image1.shape[1] - x, w + 200)  # Ensure within image bounds
    h = min(image1.shape[0] - y, h + 200)

    # Crop the image using the expanded bounding box
    cropped_image = image1[y:y+h, x:x+w]

    # Save or display the final cropped image
    cv2.imwrite(f"{CROPPED_FOLDER}/cropped_changed_area_with_margin.jpg", cropped_image)
    # To display the image, uncomment the line below
    # cv2.imshow("Cropped Changed Area with Margin", cropped_image)
    # cv2.waitKey(0)

# Clean up and close windows if displaying
cv2.destroyAllWindows()
