import React from "react";

const TextChart = ({ item }) => {
    return (
        <div>
            {item.text ? item.text : "No text available"}
        </div>
    )
} 

export default TextChart;