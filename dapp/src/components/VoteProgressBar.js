import React from "react";

const VoteProgressBar = (props) => {
    const { candidates, totalVotes } = props;

    return (
        <div className="w-full mx-auto mt-2">
            <div className="w-full bg-gray-200 rounded-lg h-6 relative flex">

                {candidates.map((candidate, index) => {

                    const perc = candidate.totalVotes ?
                        (parseInt(candidate.totalVotes) * parseInt(100)) / parseInt(totalVotes)
                        : 0;

                    return (
                        <div
                            key={candidate.id}
                            className={`
                ${candidate.id === 1 ? "bg-red-500 rounded-l-lg" : "bg-blue-500 rounded-r-lg"}
                h-full text-white text-xs pt-1 px-2
              `}
                            style={{ minWidth: '60px', width: `${perc}%` }}
                        >
                            {candidate.name} ({perc.toFixed(2)}%)
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VoteProgressBar;
