import { Line, LineChart, ResponsiveContainer } from 'recharts'

function Chart() {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        margin={{
          top: 50,
        }}
        data={[]}
      >
        <Line
          type="monotone"
          dataKey="maxTemperature"
          stroke="#fff"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
