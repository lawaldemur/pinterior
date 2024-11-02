from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

from ai import request_image_edit, get_difference_between_images

app = Flask(__name__)

UPLOAD_FOLDER = "./images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

global_data = {
    "room_image_path": None,
    "reference_image_path": None
}

@app.route('/')
def hello_world():
    return 'Hello, Pinterior!'

@app.route("/roomUpload", methods=["POST"])
def room_upload():
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(file_path)

    global_data["room_image_path"] = file_path
    print(f"Room image uploaded to {file_path}")
    return jsonify({"message": "Image uploaded successfully", "file_path": file_path}), 200


@app.route("/referenceUpload", methods=["POST"])
def reference_upload():
    if "reference" not in request.files:
        return jsonify({"error": "No reference file provided"}), 400

    reference = request.files["reference"]

    if reference.filename == "":
        return jsonify({"error": "No selected file"}), 400

    reference_filename = secure_filename(reference.filename)
    reference_path = os.path.join(app.config["UPLOAD_FOLDER"], reference_filename)
    reference.save(reference_path)

    global_data["reference_image_path"] = reference_path
    print(f"Reference uploaded to {reference_path}")

    object_edit = get_difference_between_images(global_data["room_image_path"], global_data["reference_image_path"])
    edited_image_path = request_image_edit(global_data["room_image_path"], object_edit.edit_prompt, object_edit.search_object)

    print(edited_image_path)
    return jsonify({"message": "Image edit successfully applied", "file_path": edited_image_path}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
