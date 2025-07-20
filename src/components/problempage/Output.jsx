import React from "react";
import { Base64 } from "js-base64";

const Output = React.memo(({ outputs }) => {
  console.log("output Rerendering");
  return (
    <div className="bg-blue-900 w-[30vw] z-20">
      <div>
        {console.log("outupt", outputs)}
        {outputs.map((output, index) => {
          return output.compile_output ? (
            <p key={index}>{Base64.decode(output.compile_output)}</p>
          ) : (
            <p key={index}>{output.status.description}</p>
          );
        })}
      </div>
    </div>
  );
});
export default Output;
