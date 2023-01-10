interface Props {
    timeLeft: number
}

const Timer = ({timeLeft}: Props) => {

    return (
        <div className="time-counter-container">
            <svg className="time-counter-svg">
                <circle 
                    cx={24}
                    cy={24}
                    fill="transparent"
                    r={20}
                    stroke={timeLeft < 10 ? "#a33" : "#3a3"}
                    strokeWidth={5}
                />
                <circle 
                    className="time-counter-svg-circle-foreground"
                    cx={24}
                    cy={24}
                    fill="transparent"
                    r={20}
                    stroke={"#eee"}
                    strokeWidth={6}
                    strokeDasharray={2 * Math.PI * 20}
                    strokeDashoffset={(2 * Math.PI * 20) * ((100 - ((30 - timeLeft) * (100/30))) / 100)}
                    strokeLinecap={'butt'}
                />
            </svg>
            <div className="time-counter-text-container">
                <span className="time-counter-text">
                    {timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                </span>
            </div>
        </div>
    )
}

export default Timer