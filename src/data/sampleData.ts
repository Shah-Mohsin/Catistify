import { Pet } from '../types/pet';

const today = new Date().toISOString().split('T')[0];

export const INITIAL_PETS: Pet[] = [
  {
    id: "pet_cat_luna",
    type: "cat",
    name: "Luna",
    age: "3 years",
    breed: "British Shorthair",
    gender: "Female",
    profilePicture: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80",
    personalityScores: {
      social: 19,
      curious: 23,
      playful: 21,
      affection: 22
    },
    personalityName: "THE EXPLORER",
    personalityDescription: "Your cat is curious, adventurous and always interested in discovering something new.",
    aiPersonalityInsights: "Luna exhibits a strong independent exploratory spirit coupled with deep affectionate attachment to familiar humans. Her high curiosity indicates she benefits significantly from rotating vertical puzzle toys and window perch observations.",
    diary: [
      {
        id: "entry_1",
        date: today,
        meetup: "Met Mrs. Gable and her friendly parrot through the sunny window",
        activity: "Pounced on the wool yarn ball and practiced silent stalking behind the sofa",
        discovery: "Found a hidden cardboard box behind the bookshelf and claimed it immediately",
        notes: "She purred for 20 minutes straight while being brushed on her favorite cushion.",
        mood: "happy",
        aiReflection: "Luna felt victorious finding the cardboard box castle! She considers it sovereign territory.",
        createdAt: new Date().toISOString()
      },
      {
        id: "entry_2",
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        meetup: "Chirped at two sparrows resting on the garden balcony",
        activity: "Chased the laser dot up the cat climbing tower",
        discovery: "Inspected the new automated water fountain",
        notes: "Drank fresh running water and took a 3-hour sunbath.",
        mood: "curious",
        aiReflection: "The moving water was an astonishing marvel of modern feline plumbing.",
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    dailyQuests: [
      { id: "q1", task: "Give Luna fresh water", completed: true, category: "care" },
      { id: "q2", task: "Spend some quality cuddle time with Luna", completed: true, category: "bonding" },
      { id: "q3", task: "Play with Luna for a while with the feather wand", completed: false, category: "play" },
      { id: "q4", task: "Check that Luna's space and litter box are clean", completed: true, category: "health" }
    ],
    dailyQuestDate: today,
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "pet_dog_milo",
    type: "dog",
    name: "Milo",
    age: "2 years",
    breed: "Golden Retriever",
    gender: "Male",
    profilePicture: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80",
    personalityScores: {
      social: 24,
      curious: 22,
      playful: 25,
      affection: 23
    },
    personalityName: "THE PLAYFUL ADVENTURER",
    personalityDescription: "Your dog is energetic and enthusiastic. They enjoy games, toys, movement and fun activities.",
    aiPersonalityInsights: "Milo possesses peak social and playful drives. He thrives on cooperative teamwork tasks, scent-tracking games, and meeting fellow friendly canines at the local park.",
    diary: [
      {
        id: "entry_milo_1",
        date: today,
        meetup: "Encountered Bella the Beagle and ran full speed across the meadow",
        activity: "Played 25 rounds of fetch with the yellow squeaky tennis ball",
        discovery: "Discovered an intriguing pinecone scent trail near the oak grove",
        notes: "Drank half a bowl of water and fell asleep with his chin on my sneaker.",
        mood: "playful",
        aiReflection: "Today was literally the greatest day in dog history! That tennis ball didn't stand a chance.",
        createdAt: new Date().toISOString()
      }
    ],
    dailyQuests: [
      { id: "mq1", task: "Give Milo fresh water and refill food bowl", completed: true, category: "care" },
      { id: "mq2", task: "Take Milo on a 30-minute decompression walk", completed: false, category: "health" },
      { id: "mq3", task: "Play fetch or tug-of-war for 15 minutes", completed: true, category: "play" },
      { id: "mq4", task: "Gently brush Milo's golden coat", completed: false, category: "bonding" }
    ],
    dailyQuestDate: today,
    createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
    updatedAt: new Date().toISOString()
  }
];
