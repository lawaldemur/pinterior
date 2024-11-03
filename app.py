from flask import Flask, request, jsonify
from flask_cors import CORS
from urllib.parse import quote, unquote
import os
from werkzeug.utils import secure_filename

from ai import request_image_edit, get_difference_between_images

app = Flask(__name__, static_folder='images')
CORS(app, origins=["http://localhost:3000"])

UPLOAD_FOLDER = "./images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

global_data = {
    "room_image_path": None,
    "room_image_file": None,
    "reference_image_path": None,
    "reference_image_file": None,
    "edited_image": [],
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
    global_data["room_image_file"] = filename
    print(f"Room image uploaded to {file_path}")
    return jsonify({"message": "Image uploaded successfully", "file_path": file_path}), 200


@app.route("/applyPinterestImage", methods=["POST"])
def apply_pinterest_image():
    # Check if JSON data with "url" key is present
    data = request.get_json()
    if not data or "url" not in data:
        return jsonify({"error": "No image file provided"}), 400

    image_url = unquote(data["url"]).replace("http://localhost:5005/", "./")

    object_edit = get_difference_between_images(global_data["room_image_path"], image_url)
    global_data["edited_image"].append(object_edit.search_object)

    edited_image_path = request_image_edit(global_data["room_image_path"], object_edit.edit_prompt, object_edit.search_object)
    edited_image_file = os.path.basename(edited_image_path)
    global_data["reference_image_file"] = edited_image_file

    # TODO
    global_data["room_image_path"] = edited_image_path
    global_data["room_image_file"] = edited_image_file

    print(edited_image_path)
    return jsonify({"message": "Image edit successfully applied", "file_path": "http://localhost:5005/images/" + edited_image_file }), 200


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
    global_data["reference_image_path"] = reference_path
    print(f"Reference uploaded to {reference_path}")

    object_edit = get_difference_between_images(global_data["room_image_path"], global_data["reference_image_path"])
    edited_image_path = request_image_edit(global_data["room_image_path"], object_edit.edit_prompt, object_edit.search_object)
    edited_image_file = os.path.basename(edited_image_path)

    print(edited_image_path)
    return jsonify({"message": "Image edit successfully applied", "file_path": "http://localhost:5005/images/" + edited_image_file }), 200


@app.route("/get_room_image", methods=["GET"])
def get_room_image():
    return jsonify({ "filename": "http://localhost:5005/images/" + global_data["room_image_file"]  })


def get_folder_structure(root_dir):
    folder_structure = {}

    for root, dirs, files in os.walk(root_dir):
        path_parts = os.path.relpath(root, root_dir).split(os.sep)
        current = folder_structure

        # Traverse the dictionary to the correct level
        for part in path_parts:
            if part == ".":
                continue  # Skip the root path itself
            current = current.setdefault(part, {})

        # Add files with absolute paths to the current folder's dictionary if there are any files
        if files:
            current['files'] = [quote("http://localhost:5005/images/Boards/" + os.path.relpath(root, root_dir) + "/" + file, safe=':/') for file in files]

    return folder_structure

@app.route('/board_images', methods=['GET'])
def folder_structure():
    root_dir = './images/Boards'
    folder_structure = get_folder_structure(root_dir)
    return jsonify(folder_structure)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
