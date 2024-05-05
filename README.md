# Collaborative Whiteboard App with Sketch Autocompletion

## Introduction
Welcome to our Collaborative Whiteboard App, a tool designed to enhance the way teams brainstorm and visualize ideas remotely. Our application integrates the power of artificial intelligence, specifically leveraging the `sketch-rnn` model—a Recurrent Neural Network that assists in sketching and drawing tasks. This feature improves drawing experience and enhances collaborative creative processes.

## Features
- **Real-Time Collaboration**: Work on a shared canvas with multiple users simultaneously, regardless of geographic boundaries.
- **Sketch Autocompletion**: Powered by `sketch-rnn`, our app can predict and complete user sketches, making drawing easier and more fun.
- **Intuitive Drawing Tools**: Includes a variety of drawing tools such as pens, markers, and shapes to cater to all your creative needs.
- **Interactive Canvas**: Pan and zoom functionalities to help focus on details or view the bigger picture.
- **Session Persistence**: Your work is saved in real-time and can be revisited anytime, ensuring no idea is ever lost.
- **Export Options**: Export your collaborative sketches in multiple formats for easy sharing and presentation.

## Technologies Used
- **Frontend**: React.js, Redux for state management, and Canvas API for drawing functionalities.
- **AI Model**: `ml5.js` library to integrate the `sketch-rnn` model.
- **Backend**: Node.js with Express for server-side logic; WebSocket for real-time communication.
- **Deployment**: Deployed on vercel [here](https://whiteboard-pink.vercel.app)

## Getting Started

### Prerequisites
To run this application on your local machine, you will need Node.js and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/viki0526/whiteboard.git
   cd frontend/whiteboard-app
   npm start
