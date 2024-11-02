from flask import Flask, request, jsonify
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = "./images"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Create the folder if it doesn't exist
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

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

    print(f"Image uploaded to {file_path}")
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

    print(f"Reference uploaded to {reference_path}")
    return jsonify({"message": "Reference uploaded successfully", "file_path": reference_path}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5005)
