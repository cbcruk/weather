import { useAtom } from 'jotai'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { hourlyAtom } from '../../atom/weather'

function Chart() {
  const [hourly] = useAtom(hourlyAtom)

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        margin={{
          top: 50,
        }}
        data={hourly}
      >
        <Line
          type="monotone"
          dataKey="main.temp"
          stroke="#fff"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default Chart
