import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, } from "recharts";

export default function PostViewLineChart({ data }) {
    const { posts, series } = data;
    const chartData = series.map(item => ({
        date: item.date,
        ...item.values,
    }));
    const LINE_COLORS = ["#88de76","#7abb6c","#608958","#42603d","#1c2a1a"];
    const CustomDot = ({cx, cy, color, r = 5}) => {
        return<circle cx={cx} cy={cy} r={r} fill={color}/>
    };

    return (
        <div style={{ width: "95%", height: 400 }}>
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} domain={[0, 'dataMax + 1']} />
                    <Tooltip />
                    <Legend />

                    {posts.map((post,i) => {
                        
                        const color = LINE_COLORS[i % LINE_COLORS.length];

                        return(
                        <Line
                            key={post.postIndex}
                            type="monotone"
                            dataKey={String(post.postIndex)}
                            name={post.title}
                            strokeWidth={2}
                            stroke={color}
                            dot={(props) => (<CustomDot {...props} color = {color}/>)}
                            activeDot={(props) => (
                                <CustomDot {...props} color={color} r={7}/>
                            )}
                        />
                    )
})}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}