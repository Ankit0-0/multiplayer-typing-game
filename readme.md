# SpeedType Showdown

SpeedType Showdown is a real-time multiplayer typing race game where players can test their typing skills against the clock and compete with friends.

## Features

- **Real-time Multiplayer:** Play against friends and other players in real-time typing races.
- **Multiple Rooms:** Supports the creation and concurrent playing of multiple rooms without interference, allowing for scalable gameplay.
- **Smooth User Experience:** Utilizes WebSocket technology (Socket.io) to achieve smooth real-time communication with an average latency of 73 milliseconds, ensuring a seamless gaming experience.

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js
- **Real-time Communication:** Socket.io
- **Build Tool:** Vite

## Getting Started

To get started with SpeedType Showdown, follow these steps:

1. Clone this repository to your local machine.
2. Install dependencies by running `npm install`.
3. Start the development server by running `npm start`.
4. Navigate to `http://localhost:3000` in your web browser to access the application.

## Usage

1. Enter your name and click "Create Room" to create a new game room, or enter an existing room ID and click "Join Room" to join an existing game.
2. Once inside a room, wait for other players to join or start the game if you're the room owner.
3. Type the displayed text as fast as you can within the time limit to compete against other players.
4. After the game ends, see your statistics and compare them with other players.

## Contributing

Contributions are welcome! If you'd like to contribute to SpeedType Showdown, please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the [MIT License](LICENSE).
