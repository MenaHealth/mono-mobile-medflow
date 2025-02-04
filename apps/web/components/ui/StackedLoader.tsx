import React from 'react';
import {BounceLoader, CircleLoader, DotLoader, PropagateLoader, SkewLoader} from 'react-spinners';

const StackedLoader: React.FC = () => {
    const orangeShades = [
        'text-red-500',
        'text-yellow-200',
        'text-orange-500',

    ];

    return (
        <div className="relative w-[300px] h-[300px]">
            {orangeShades.map((colorClass, index) => {
                const rotation = index * 20; // 20 degrees rotation for each loader
                const isHighestZIndex = index === orangeShades.length - 1;
                return (
                    <div
                        key={index}
                        className={`absolute inset-0 flex items-center justify-center ${colorClass}`}
                        style={{
                            transform: `rotate(${rotation}deg)`,
                            zIndex: index + 1,
                        }}
                    >
                        <CircleLoader color="currentColor" size={150} />
                    </div>
                );
            })}
        </div>
    );
};

export default StackedLoader;

