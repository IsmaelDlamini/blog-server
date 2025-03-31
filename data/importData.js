// import { client } from "../mongodb/setup.js";

export const data = [
  {
    PostType: "BLOG",
    DatePosted: "20 January 2024",
    PostLenght: "2-Mins",
    PostTitle:
      "Side Hustles that you can undertake as a University student to make more cash",
    PostDescription:
      "Discover profitable side hustles for university students to earn extra cash while managing studies.",
    PostImage: null,
  },

  {
    PostType: "BLOG",
    DatePosted: "20 January 2024",
    PostLenght: "2-Mins",
    PostTitle: "Is AI going to replace software engineers?",
    PostDescription:
      "Explore if AI will replace software engineers or redefine their roles in the tech industry.",
    PostImage: null,
  },

  {
    PostType: "BLOG",
    DatePosted: "20 January 2024",
    PostLenght: "2-Mins",
    PostTitle:
      "Top Coding Projects to Build Your Skills as a Software Engineer.",
    PostDescription:
      "Explore coding projects to enhance your skills and boost your software engineering portfolio.",
    PostImage: null,
  },
];

// const myDatabase = client.db("Blog");
// const myCollection = myDatabase.collection("posts");

// export const insertData = async () => {
//   try {
//     const insertion = await myCollection.insertMany(data);
//     console.log(insertion);
//     console.log("Data inserted successfully");
//   } catch (err) {
//     console.log(err);
//   }
// };
