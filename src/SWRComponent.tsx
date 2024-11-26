import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import useSWR, { preload } from "swr";
import useSWRMutation from "swr/mutation";

let todos = [{ id: new Date(), text: 'dasdsad' }];

const delay = () => new Promise<void>((res) => setTimeout(() => res(), 1000));

export async function getTodos() {
  delay();
  if (Math.random() < 0.5) throw new Error("Failed to get item!");
  return todos;
}

export async function addTodo(todo: { id: Date, text: string }) {
  await delay();
  if (Math.random() < 0.5) throw new Error("Failed to add new item!");
  todos = [...todos, todo];
  return todos;
}
preload("/api/todos", getTodos)

const SWRComponent = () => {
  const [conditionalFetch, isConditionalFetch] = useState(false);
  const [text, setText] = useState("");
  const { data, mutate } = useSWR(conditionalFetch ? "/api/todos" : null, getTodos, {
    onErrorRetry: (error, key, config, revalidate, { retryCount }) => {

      toast.error('Error, retry count: ' + retryCount);
      if (retryCount >= 5) {
        return

      }

      setTimeout(() => revalidate({ retryCount }), 1000)
    },
    onSuccess: () => toast.success("Successfully get todos"),

  });

  const { trigger } = useSWRMutation("/api/todos", getTodos)


  return (
    <div style={{ border: '1px solid grey', padding: '20px' }}>
      <Toaster toastOptions={{ position: "top-center" }} />
      <h2>SWRComponent</h2>
      <form onSubmit={(ev) => ev.preventDefault()}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <button
          type="submit"
          disabled={!data}
          onClick={async () => {
            setText("");

            const newTodo = {
              id: new Date(),
              text,
            };

            try {
              await mutate(addTodo(newTodo), {
                optimisticData: data ? [...data, newTodo] : [newTodo],
                rollbackOnError: true,
                populateCache: true,
                revalidate: false,
              });
              toast.success("Successfully added the new item.");
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (e: any) {
              toast.error(e.message);
            }
          }}
        >
          Add
        </button>
        <button disabled={!data} type="submit" onClick={() => trigger()}>refresh</button>
        <button onClick={() => isConditionalFetch((prev) => !prev)}>Get todos</button>
      </form>
      <ul>
        List:
        {data
          ? data.map((todo, index) => {
            return <li key={index}>{todo.text}</li>;
          })
          : null}
      </ul>
    </div>
  )
}

export default SWRComponent