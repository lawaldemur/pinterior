import os
import base64
import requests
from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

os.makedirs("images", exist_ok=True)
os.makedirs("rendered", exist_ok=True)

load_dotenv()
STABILITY_KEY = os.getenv("STABILITY_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI()

class ObjectEditing(BaseModel):
    search_object: str
    edit_prompt: str


PROMPT = """
Reference Image (the first image): This is the current room that I want to enhance. Keep the structure of this room unchanged, using it as a starting point.

Inspiration Image (the second image): This could be any space or item that conveys a style, mood, or aesthetic quality. This image is not necessarily from the same type of room as the reference image but should serve as a creative influence or thematic guide.

Task: Using the inspiration image to inform your decision, make a single change to the reference image that best elevates or enhances its aesthetic. This change can be a color adjustment, a furniture upgrade, a lighting choice, or any other design element.

Please provide an object to search for and a what do you want to see instead of this according to the style difference, showcasing the chosen single change that best improves the room’s overall aesthetic while preserving its original structure. I'll edit design of the chosen search object in the first reference image according to the suggested prompt based on the second inspiration image.
"""
#  You don’t need to replicate an item from the inspiration image directly; instead, focus on capturing the essence or vibe and apply it in a subtle, high-level manner.

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


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

def get_difference_between_images(image1, image2):
    base64_image1 = encode_image(image1)
    base64_image2 = encode_image(image2)

    messages = [
        {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": PROMPT,
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image1}",
                },
            },
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{base64_image2}",
                },
            },
        ],
        }
    ]

    print("difference processing")
    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=messages,
        response_format=ObjectEditing,
    )
    edit_object = response.choices[0].message.parsed

    print(f"{edit_object.search_object}: {edit_object.edit_prompt}")
    return edit_object