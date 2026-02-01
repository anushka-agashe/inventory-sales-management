import "../../styles/Home/SalesPurchase.css";
import { useEffect, useState } from "react";
import axios from "axios";
import calender from "../../assets/icons/Calendar.png";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const SalesPurchase = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [range, setRange] = useState("weekly");
  const [data, setData] = useState([]);
  const [yMax, setYMax] = useState(5000);
  const displayCount = 5; // number of items to show at a time

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getNextRange = (current) => {
    if (current === "weekly") return "monthly";
    if (current === "monthly") return "yearly";
    return "weekly";
  };

  // Generate weekly labels for a given month
  const generateWeeklyLabels = (year, month) => {
    const labels = [];
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0); // last day of month
    let current = new Date(startDate);

    while (current <= endDate) {
      const startDay = current.getDate();
      const tempEnd = new Date(current);
      tempEnd.setDate(tempEnd.getDate() + 6);
      let endDay = tempEnd.getDate();
      if (tempEnd > endDate) endDay = endDate.getDate();

      labels.push(`${startDay}-${endDay} ${monthNames[month]}`);
      current.setDate(current.getDate() + 7);
    }

    return labels;
  };

  // Generate monthly labels from Jan 2021
  const generateMonthlyLabels = () => {
    const labels = [];
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    for (let y = startYear; y <= currentYear; y++) {
      for (let m = 0; m < 12; m++) {
        labels.push(`${monthNames[m]} ${y}`);
      }
    }
    return labels;
  };

  // Generate yearly labels from 2021
  const generateYearlyLabels = () => {
    const labels = [];
    const startYear = 2021;
    const currentYear = new Date().getFullYear();
    for (let y = startYear; y <= currentYear; y++) {
      labels.push(`${y}`);
    }
    return labels;
  };

  const fetchChartData = async (selectedRange) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/transactions/summary?range=${selectedRange}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );

      let { labels, sales, purchases } = res.data;

      if (selectedRange === "weekly") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weeks = [];

        for (let w = 4; w >= 0; w--) {
          const endDate = new Date(today);
          endDate.setDate(today.getDate() - w * 7);

          const startDate = new Date(endDate);
          startDate.setDate(endDate.getDate() - 6);

          weeks.push({
            name: `${startDate.getDate()} ${monthNames[startDate.getMonth()]} - ${endDate.getDate()} ${monthNames[endDate.getMonth()]}`,
            start: new Date(startDate),
            end: new Date(endDate),
            Sales: 0,
            Purchases: 0,
          });
        }

        labels.forEach((label, i) => {
          const txDate = new Date(label);
          txDate.setHours(0, 0, 0, 0);

          const bucket = weeks.find(
            (w) => txDate >= w.start && txDate <= w.end,
          );

          if (bucket) {
            bucket.Sales += sales[i] || 0;
            bucket.Purchases += purchases[i] || 0;
          }
        });

        setData(weeks);

        const maxValue = Math.max(
          ...weeks.map((d) => d.Sales),
          ...weeks.map((d) => d.Purchases),
        );

        const step =
          maxValue > 0 ? Math.pow(10, Math.floor(Math.log10(maxValue))) : 10;
        setYMax(Math.ceil(maxValue / step) * step);

        return;
      }

      if (selectedRange === "monthly") {
        labels = generateMonthlyLabels();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const currentIndex = labels.findIndex(
          (l) => l === `${monthNames[currentMonth]} ${currentYear}`,
        );
        labels = labels.slice(
          currentIndex - displayCount + 1 >= 0
            ? currentIndex - displayCount + 1
            : 0,
          currentIndex + 1,
        );

        if (sales.length < labels.length) {
          const diff = labels.length - sales.length;
          sales = [...Array(diff).fill(0), ...sales];
          purchases = [...Array(diff).fill(0), ...purchases];
        }

        const formatted = labels.map((label, i) => ({
          name: label,
          Sales: sales[i],
          Purchases: purchases[i],
        }));
        setData(formatted);
        const maxValue = Math.max(
          ...formatted.map((d) => d.Sales),
          ...formatted.map((d) => d.Purchases),
        );
        const step = Math.pow(10, Math.floor(Math.log10(maxValue)));
        setYMax(Math.ceil(maxValue / step) * step);
        return;
      }

      if (selectedRange === "yearly") {
        labels = generateYearlyLabels();
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentIndex = labels.findIndex((l) => l === `${currentYear}`);
        labels = labels.slice(
          currentIndex - displayCount + 1 >= 0
            ? currentIndex - displayCount + 1
            : 0,
          currentIndex + 1,
        );

        if (sales.length < labels.length) {
          const diff = labels.length - sales.length;
          sales = [...Array(diff).fill(0), ...sales];
          purchases = [...Array(diff).fill(0), ...purchases];
        }

        const formatted = labels.map((label, i) => ({
          name: label,
          Sales: sales[i],
          Purchases: purchases[i],
        }));
        setData(formatted);
        const maxValue = Math.max(
          ...formatted.map((d) => d.Sales),
          ...formatted.map((d) => d.Purchases),
        );
        const step = Math.pow(10, Math.floor(Math.log10(maxValue)));
        setYMax(Math.ceil(maxValue / step) * step);
        return;
      }
    } catch (err) {
      console.error("Error fetching chart data", err);
    }
  };

  const handleToggle = () => {
    const nextRange = getNextRange(range);
    setRange(nextRange);
    fetchChartData(nextRange);
  };

  useEffect(() => {
    fetchChartData(range);
  }, []);

  return (
    <div className="salesPurchase-container">
      <div className="sales-header">
        <h2>Sales & Purchases</h2>
        <div className="range-buttons">
          <button onClick={handleToggle}>
            <img src={calender} alt="" />
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </button>
        </div>
      </div>

      <ResponsiveContainer width="90%" height={280}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A8E063" stopOpacity={1} />
              <stop offset="100%" stopColor="#56AB2F" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="purchaseColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8EC5FC" stopOpacity={1} />
              <stop offset="100%" stopColor="#0072FF" stopOpacity={1} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E0E0E0" />

          <XAxis
            dataKey="name"
            tick={{ fontSize: isMobile ? 10 : 12 }}
            interval={isMobile ? "preserveStartEnd" : 0}
            angle={isMobile ? -25 : 0}
            textAnchor={isMobile ? "end" : "middle"}
            height={isMobile ? 60 : 30}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: isMobile ? 10 : 12 }}
            domain={[0, yMax]}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip formatter={(value) => value} />

          <Legend wrapperStyle={{ fontSize: isMobile ? "10px" : "12px" }} />

          <Bar
            dataKey="Sales"
            fill="url(#salesColor)"
            radius={[6, 6, 0, 0]}
            barSize={isMobile ? 14 : 20}
          />
          <Bar
            dataKey="Purchases"
            fill="url(#purchaseColor)"
            radius={[6, 6, 0, 0]}
            barSize={isMobile ? 14 : 20}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesPurchase;
