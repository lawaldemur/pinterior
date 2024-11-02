import os
import requests
from dotenv import load_dotenv

os.makedirs("images", exist_ok=True)
os.makedirs("rendered", exist_ok=True)

load_dotenv()
STABILITY_KEY = os.getenv("STABILITY_KEY")

def send_generation_request(
    host,
    params,
):
    headers = {
        "Accept": "image/*",
        "Authorization": f"Bearer {STABILITY_KEY}"
    }

    # Encode parameters
    files = {}
    image = params.pop("image", None)
    mask = params.pop("mask", None)
    if image is not None and image != '':
        files["image"] = open(image, 'rb')
    if mask is not None and mask != '':
        files["mask"] = open(mask, 'rb')
    if len(files)==0:
        files["none"] = ''

    # Send request
    print(f"Sending REST request to {host}...")
    response = requests.post(
        host,
        headers=headers,
        files=files,
        data=params
    )
    if not response.ok:
        raise Exception(f"HTTP {response.status_code}: {response.text}")

    return response


def request_image_edit(image_path, edit_prompt, search_object):
    image = image_path
    prompt = edit_prompt #@param {type:"string"}
    search_prompt = search_object #@param {type:"string"}
    negative_prompt = "" #@param {type:"string"}
    seed = 0 #@param {type:"integer"}
    output_format = "png" #@param ["webp", "jpeg", "png"]

    host = f"https://api.stability.ai/v2beta/stable-image/edit/search-and-replace"

    params = {
        "image" : image,
        "seed" : seed,
        "mode": "search",
        "output_format": output_format,
        "prompt" : prompt,
        "negative_prompt" : negative_prompt,
        "search_prompt": search_prompt,
    }

    response = send_generation_request(
        host,
        params
    )

    # Decode response
    finish_reason = response.headers.get("finish-reason")
    seed = response.headers.get("seed")

    # Check for NSFW classification
    if finish_reason == 'CONTENT_FILTERED':
        raise Warning("Generation failed NSFW classifier")

    # Save and display result
    filename, _ = os.path.splitext(os.path.basename(image))
    edited = f"rendered/edited_{filename}_{seed}.{output_format}"
    with open(edited, "wb") as f:
        f.write(response.content)  # Use response.content to get the image bytes
    print(f"Saved image {edited}")

    return edited