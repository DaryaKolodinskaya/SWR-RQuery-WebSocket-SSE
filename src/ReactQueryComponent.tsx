import { useQuery } from "@tanstack/react-query"

function ReactQueryComponent() {
  const { isPending, error, data } = useQuery({
    queryKey: ['users'],
    queryFn: () =>
      fetch('https://6745ca3c512ddbd807f9a797.mockapi.io/mock/users').then((res) =>
        res.json(),
      ).catch((err) => console.log(err)),
  })

  if (isPending) return 'Loading...'

  if (error) return 'An error has occurred: ' + error.message

  return (
    <div style={{ border: '1px solid grey', padding: '20px', height: '200px', overflow: 'scroll' }}>
      <h2>ReactQueryComponent</h2>
      <strong>status: {data ? 'ok' : 'error'}</strong>
      <ul>
        {data.map((user) => (
          <li key={user.createdAt}>{user.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default ReactQueryComponent