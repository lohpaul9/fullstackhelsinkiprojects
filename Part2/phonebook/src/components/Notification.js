const Notification = ({message, isError}) => {
    const errorStyle = {
        color : 'red',
        fontStyle : 'bold',
        border : 'solid 5px'
    }

    const noErrorStyle = {
        color : 'green',
        fontStyle : 'bold',
        border : 'solid 5px'
    }

    if (message === undefined) {
        return <></>
    }

    return (
        <div style={isError?errorStyle:noErrorStyle}>
            {message}
        </div>
    )
}

export default Notification