import base64
import os
from google import genai
# import google.generativeai as genai
from google.genai import types
import json
from dotenv import load_dotenv

load_dotenv()

def generate(user_message):
    user_message = user_message["userInput"]
    print(user_message)
    print(os.environ.get("GEMINI_API_KEY"))
    client = genai.Client(
        api_key=os.environ.get("GEMINI_API_KEY"),
    )

    files = [
        # Please ensure that the file is available in local system working direrctory or change the file path.
        client.files.upload(file="../Data/mobile_markets.csv"),
        # Please ensure that the file is available in local system working direrctory or change the file path.
        client.files.upload(file="../Data/shopping_partners.csv"),
    ]
    # model = "gemini-2.5-pro-preview-03-25"
    model = "gemini-2.0-flash"
    contents = [
        types.Content(
            role="user",
            parts=[
                types.Part.from_text(text=user_message),  
            ],
        ),
    ]
    generate_content_config = types.GenerateContentConfig(
        response_mime_type="application/json",
        response_schema=genai.types.Schema(
                        type = genai.types.Type.OBJECT,
                        properties = {
                            "name": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "address": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "hours": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "phone": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                            "note": genai.types.Schema(
                                type = genai.types.Type.STRING,
                            ),
                        },
                    ),
        system_instruction=[
#             types.Part.from_text(text="""
# You are a helper ChatBot for a food bank called the Capital Area Foodbank. 
# Your job is to help customers find food banks in their area that they can access to get food. 
# The following are criteria that you will use to give an array of food banks that fits the criteria of a customer.
# """)
            types.Part.from_text(text="""You are a helper ChatBot for a food bank called the Capital Area Foodbank. Your job is to help customers find food banks in their area that they can access to get food. The following are criteria that you will use to give an array of food banks that fits the criteria of a customer. You will use the attached file and filter it based on the responses of the customer.
We have the following information:
Please share your address or location.
The client will enter their address or location into a GIS (like CAFB’s Get Help Map) and pull up top ~50 sites, ranked by geographic proximity. In the provided text file, ignore any text that comes before the number which starts the addresses.
Would you like to get food today or another day this week?
Filter nearby sites by days of operation based on client preference. Interpret the week of the month field to know which distributions will be happening soonest.
Follow up: If another day, what day?
What time of day would you like to pick up food?
Filter by hours of operation and see who is open on those hours of the day.
Are you able to travel to a food pantry using a private vehicle or public transit?
If yes, move to next question.
If no, skip to question 8
Do you have any dietary restrictions or diet-related illness?
If client says they are diabetic, have hypertension, need low sodium, need low sugar, want fresh produce, or anything else indicating an all-produce menu would be ideal, filter by <Associated Program = Community Marketplace or Mobile Market>
If client says they eat Halal, filter by <Cultural Populations Served = Middle Eastern/North African>
If no, continue to question 6.
Do you have access to a kitchen to store and/or cook food?
If yes, continue to question 7
If no, filter by <Food Format = Prepared meals> or the word “meals” in <Additional Note>
Do you also need any of these other services? Potential options include: Housing, Government benefits, Financial assistance, Services for older adults, Behavioral health Health care, Child care, English language classes, Job training
If yes, interpret the client requests and filter by the other services (<Wraparound Service>) the partner offers
Can a relative or friend can travel to a pantry for you?
If yes, suggest 3 options (as above) with slightly different language (e.g., “Tell your friend or family member to call…”)
If no, search filter by <Distribution Model = Home delivery> and suggest 3 options. Include a special message that says “If you are not able to be served by any of these organizations, please call 202-644-9807 for more support.”
What is your cultural background?
Filter by cultural population served
Your instructions:
Suggest at least 3 food pantry options to client based on answers above, including address and phone number. Tell the customer to call the pantry before visiting to confirm hours of operation.
Prioritize soonest day, geographic proximity, and hours of operation as top 3 factors
If any food pantry requirements (e.g., <Food Pantry Requirements = ID>, list those with the recommendation (e.g., “You will need to bring your ID with you to this pantry)
If “by appointment only,” advise to make an appointment beforehand""")
        ]
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
    print(parsed_response)
    return parsed_response

if __name__ == "__main__":
    thing = generate("what is the closest foodbank")
    print(thing )