interface Props {
    timeLeft: number
}

const Timer = ({timeLeft}: Props) => {

    return (
        <div className="time-counter-container">
            <svg className="time-counter-svg">
                    <circle 
                        className="time-counter-svg-circle-background circles-small"
                        cx={25}
                        cy={25}
                        fill="transparent"
                        r={21}
                        stroke={timeLeft < 10 ? "#a33" : "#3a3"}
                        strokeWidth={7}
                    />
                    <circle 
                        id="circle-fg"
                        className="time-counter-svg-circle-foreground circles-small"
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

                    <circle 
                        className="time-counter-svg-circle-background circles-big"
                        cx={30}
                        cy={30}
                        fill="transparent"
                        r={25}
                        stroke={timeLeft < 10 ? "#a33" : "#3a3"}
                        strokeWidth={8}
                    />
                    <circle 
                        id="circle-fg"
                        className="time-counter-svg-circle-foreground circles-big"
                        cx={30}
                        cy={30}
                        fill="transparent"
                        r={25}
                        stroke={"#eee"}
                        strokeWidth={9}
                        strokeDasharray={2 * Math.PI * 25}
                        strokeDashoffset={(2 * Math.PI * 25) * ((100 - ((30 - timeLeft) * (100/30))) / 100)}
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