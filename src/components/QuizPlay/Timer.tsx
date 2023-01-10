interface Props {
    timeLeft: number
}

const Timer = ({timeLeft}: Props) => {

    return (
        <div className="time-counter-container">
            <svg className="time-counter-svg">
                <circle 
                    className="time-counter-svg-circle-background"
                    cx={25}
                    cy={25}
                    fill="transparent"
                    r={21}
                    stroke={timeLeft < 10 ? "#a33" : "#3a3"}
                    strokeWidth={7}
                />
                <circle 
                    id="circle-fg"
                    className="time-counter-svg-circle-foreground"
                    cx={25}
                    cy={25}
                    fill="transparent"
                    r={21}
                    stroke={"#eee"}
                    strokeWidth={8}
                    strokeDasharray={2 * Math.PI * 21}
                    strokeDashoffset={(2 * Math.PI * 21) * ((100 - ((30 - timeLeft) * (100/30))) / 100)}
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