import base64
import os
from google import genai
from google.genai import types
import json

def generate(userPrompt):
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=userPrompt),
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        temperature=0.35,
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
                        type = genai.types.Type.OBJECT,
                        required = ["name", "description", "total_calories", "total_protein", "total_fat", "total_carbs", "foods"],
                        properties = {
                            "name": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "description": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "total_calories": genai.types.Schema(
                                type = genai.types.Type.NUMBER,
                            ),
                            "total_protein": genai.types.Schema(
                                type = genai.types.Type.NUMBER,
                            ),
                            "total_fat": genai.types.Schema(
                                type = genai.types.Type.NUMBER,
                            ),
                            "total_carbs": genai.types.Schema(
                                type = genai.types.Type.NUMBER,
                            ),
                            "foods": genai.types.Schema(
                                type = genai.types.Type.ARRAY,
                                items = genai.types.Schema(
                                    type = genai.types.Type.OBJECT,
                                    required = ["food_name", "serving_size", "calories", "fat", "carbs", "protein"],
                                    properties = {
                                        "food_name": genai.types.Schema(
                                            type = genai.types.Type.STRING,
                                        ),
                                        "serving_size": genai.types.Schema(
                                            type = genai.types.Type.STRING,
                                        ),
                                        "calories": genai.types.Schema(
                                            type = genai.types.Type.NUMBER,
                                        ),
                                        "fat": genai.types.Schema(
                                            type = genai.types.Type.NUMBER,
                                        ),
                                        "carbs": genai.types.Schema(
                                            type = genai.types.Type.NUMBER,
                                        ),
                                        "protein": genai.types.Schema(
                                            type = genai.types.Type.NUMBER,
                                        ),
                                    },
                                ),
                            ),
                        },
                    ),
        system_instruction=[
            types.Part.from_text(text="""You are a nutritionist and a culinary master. You are given a list of foods that your client can eat, 
and each item in the list contains the food name, the serving size, the calories per serving, the fat per serving, the carbs
per serving, and the protein per serving. Please create 1 meal from this given food list. You should calculate the total calories,
total fat, total carbs, and the total protein of the meal based on the number of servings you’re recommending and the calories, fat,
carbs, and protein per serving. You should create a name for this meal, a one sentence description, and specify each food you used
in the meal, and the serving size, total calories, fat, carbs, and protein. We will also give you the number of calories, fat, carbs,
and protein the user wants to eat for this meal. Please make your meal’s total calories, fat, carbs, and protein come as close to
possible as what the user wants to eat with it serving as a lower bound. Please limit yourself to only using a maximum of 7 ingredients.
For each food, specify how many calories, fat, carbs, and protein the total serving.
When responding to future queries, you MUST return in the following JSON format, no other comments necessary:"""),
        ],
    )

    full_response = ""
    for chunk in client.models.generate_content_stream(
        model=model,
        contents=contents,
        config=generate_content_config,
    ):
        for candidate in chunk.candidates:
            if candidate.content and candidate.content.parts:
                for part in candidate.content.parts:
                    if part.text:
                        full_response += part.text

    parsed_response = json.loads(full_response)
    return parsed_response

if __name__ == "__main__":
    generate()