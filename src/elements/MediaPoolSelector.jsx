import React from 'react';

export default (props) => {
    switch (props.type) {
        case "VIDEO":
            return (
                <select value={props.value} onChange={props.onChange} disabled={props.disabled}>
                    <option value=''>Choose a Video...</option>
                    {props.config.videoPool.map((video) => {
                        return <option key={`video-${video._id}-${props.keySuffix}`} value={video._id}>{video.name}</option>
                    })}
                </select>
            );
        case "AUDIO":
            return (
                <select value={props.value} onChange={props.onChange} disabled={props.disabled}>
                    <option value=''>Choose a Sound...</option>
                    {props.config.audioPool.map((audio) => {
                        return <option key={`audio-${audio._id}-${props.keySuffix}`} value={audio._id}>{audio.name}</option>
                    })}
                </select>
            );
        case "IMAGE":
            return (
                <select value={props.value} onChange={props.onChange} disabled={props.disabled}>
                    <option value=''>Choose a Gif...</option>
                    {props.config.imagePool.map((image) => {
                        return <option key={`image-${image._id}-${props.keySuffix}`} value={image._id}>{image.name}</option>
                    })}
                </select>
            );
        default:
            return <></>
    }
}