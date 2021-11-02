import { useAtom } from 'jotai'
import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { weatherAtom } from '../../atom/weather'

function Chart() {
  const [{ weather }] = useAtom(weatherAtom)
  const { weekly } = weather

  return (
    <ResponsiveContainer width="100%" height={100}>
      <LineChart
        margin={{
          top: 50,
        }}
        data={weekly}
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
