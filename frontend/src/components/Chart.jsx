import { Line } from 'react-chartjs-2'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import styles from './Chart.module.css'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export default function Chart({ type, data, options, title }) {
  const defaultLineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#000',
        padding: 8,
        titleFont: {
          family: 'JetBrains Mono',
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          family: 'JetBrains Mono',
          size: 11,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'JetBrains Mono',
            size: 10,
            weight: 'bold',
          },
        },
      },
      y: {
        grid: {
          borderDash: [2, 2],
          color: '#888',
        },
        ticks: {
          font: {
            family: 'JetBrains Mono',
            size: 10,
            weight: 'bold',
          },
        },
      },
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 2,
      },
      point: {
        radius: 4,
        hoverRadius: 6,
        borderWidth: 2,
        backgroundColor: '#fff',
      },
    },
  }

  const defaultPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 10,
          font: {
            family: 'JetBrains Mono',
            size: 10,
            weight: 'bold',
          },
        },
      },
      tooltip: {
        backgroundColor: '#000',
        padding: 8,
        titleFont: {
          family: 'JetBrains Mono',
          size: 12,
          weight: 'bold',
        },
        bodyFont: {
          family: 'JetBrains Mono',
          size: 11,
        },
      },
    },
  }

  const chartOptions = type === 'line' ? { ...defaultLineOptions, ...options } : { ...defaultPieOptions, ...options }

  return (
    <div className={styles.chartContainer}>
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.chartWrapper}>
        {type === 'line' ? (
          <Line data={data} options={chartOptions} />
        ) : (
          <Pie data={data} options={chartOptions} />
        )}
      </div>
    </div>
  )
}
