import React from "react";

export default function History(props: {
  history: string[]
}) {
  return (
    <section>
      <h1>
        History:
      </h1>
      <details>
        <ul className="history-list">
          {props.history.map((ins, index) => (
            <li key={index}>
              <code>{ins}</code>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}