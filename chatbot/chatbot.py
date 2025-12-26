import os
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
DEEPINFRA_API_KEY = os.getenv("DEEPINFRA_API_KEY")

def chat_with_deepinfra(user_input, model="mistralai/Mixtral-8x7B-Instruct-v0.1"):
    """Send a message to DeepInfra's API and return the assistant's reply."""
    response = requests.post(
        "https://api.deepinfra.com/v1/openai/chat/completions",
        headers={"Authorization": f"Bearer {DEEPINFRA_API_KEY}"},
        json={
            "model": model,
            "messages": [{"role": "user", "content": user_input}],
            "max_tokens": 500,
        }
    )
    return response.json()["choices"][0]["message"]["content"]

def main():
    """Main chat loop."""
    print("Chat with DeepInfra (Type 'quit' to exit)")
    while True:
        user_input = input("You: ")  # This defines user_input properly
        if user_input.lower() in ["quit", "exit"]:
            break
        response = chat_with_deepinfra(user_input)
        print(f"Assistant: {response}")

if __name__ == "__main__":
    main()