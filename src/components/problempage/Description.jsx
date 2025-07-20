import React from "react";

const Description = React.memo(({ question }) => {
  console.log("description Rerendering");

  return (
    <div className="w-[40%]">
      <p>
        {question.uid} {question.title}
      </p>
      <p>{question.difficulty}</p>
      <p>{question.description}</p>
      {question.topics.map((topic) => (
        <p key={topic}>{topic}</p>
      ))}
    </div>
  );
});

export default Description;
