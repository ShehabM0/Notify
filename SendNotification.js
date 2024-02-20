export default async function SendNotification(token, title, body, setSubmitLoad) {
    const URL = "https://exp.host/--/api/v2/push/send";

    const notification = {
        to: token,
        title: title ? title : "Notified 🌍",
        body: body ? body: "Happy Development",
        data: {
            subData1: "Expo",
            subData2: "Notifications"
        }
    };

    fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification)
    })
    .then(async response => {
        const result = await response.json();
        console.log(result);
    })
    .catch (error => console.log(error))
    .finally (() => {
        setSubmitLoad(false);
    });
}