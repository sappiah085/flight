import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useMemo } from "react";

interface PriceDataPoint {
  date: string;
  price: number;
  label: string;
}

interface PriceGraphProps {
  data: PriceDataPoint[];
}

export function PriceGraph({ data }: PriceGraphProps) {
  const minPrice = useMemo(() => Math.min(...data.map((d) => d.price)), [data]);
  const maxPrice = useMemo(() => Math.max(...data.map((d) => d.price)), [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card rounded-xl border border-border/60 p-3 shadow-elevated">
          <p className="text-sm font-medium text-foreground">{data.label}</p>
          <p className="text-lg font-bold text-primary">
            ${data.price.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="floating-card p-5 lg:p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Price Trends
          </h3>
          <p className="text-sm text-muted-foreground">Prices across dates</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="text-muted-foreground font-medium">
              Low: ${minPrice}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-primary/40" />
            <span className="text-muted-foreground font-medium">
              High: ${maxPrice}
            </span>
          </div>
        </div>
      </div>

      <div className="h-48 lg:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(152, 45%, 35%)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(152, 45%, 35%)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(148, 20%, 88%)"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "hsl(150, 15%, 45%)",
                fontSize: 12,
                fontWeight: 500,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "hsl(150, 15%, 45%)",
                fontSize: 12,
                fontWeight: 500,
              }}
              tickFormatter={(value) => `$${value}`}
              dx={-10}
              domain={["dataMin - 50", "dataMax + 50"]}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip active={props.active} payload={props.payload} />
              )}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="hsl(152, 45%, 35%)"
              strokeWidth={2.5}
              fill="url(#priceGradient)"
              animationDuration={500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
