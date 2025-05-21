This project is the frontend of our Roleplay Chat application, that allow the user to chat with a character using AI to generate answer.

The user will be able to access, create, and delete:
 - characters: the character that the user will be able to talk with, or tell a story with
 - userProfiles: the profile that will use the user to impersonate him in the chat or the story
 - systemPrompts: the system prompt that will be sent at the beginning of a chat session so the AI know to react to the user messages
 - aiModels: the ai model that the user will use to generate the answer

A header on the app will give access to all of this pages: characters, userProfiles, systemPrompts, aiModels, applicationSettings.

 The chat itself will exist inside a chatSession.
 The user can start a new chatSession, or access an already existing one, when he is on a character page.
 The homepage will display the last chat sessions updated by the user