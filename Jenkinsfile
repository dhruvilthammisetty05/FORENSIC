pipeline {
    agent any

    environment {
        // You can define environment variables here
        DOCKER_COMPOSE_VERSION = 'v2'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout the code from GitHub (configured in the Jenkins job)
                checkout scm
            }
        }

        stage('Install Frontend Dependencies & Lint') {
            steps {
                dir('frontend') {
                    // Running under Node environment or simply invoking docker run if you have local Node
                    bat 'npm install'
                    // Uncomment the below if you have linting setup:
                    // sh 'npm run lint'
                }
            }
        }

        stage('Install Backend Dependencies & Lint') {
            steps {
                dir('backend') {
                    bat 'npm install'
                }
            }
        }
        
        stage('Blockchain Smart Contracts') {
            steps {
                dir('blockchain') {
                    bat 'npm install'
                    // Compiling smart contracts
                    bat 'npx truffle compile'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                // Testing docker build of the environment
                bat 'docker compose build'
            }
        }

        stage('Deploy / Run Tests') {
            steps {
                echo "Here you would typically run your tests, e.g. docker compose up -d, and run integration tests."
                // Example: bringing down any previous state and bringing it up
                // bat 'docker compose down'
                // bat 'docker compose up -d'
                
                // For a true CI pipeline, you might just run particular test scripts here instead of a full deploy.
                echo "Pipeline execution completed successfully!"
            }
        }
    }

    post {
        always {
            // Clean up workspace if necessary
            cleanWs()
            echo 'Build lifecycle completed.'
        }
        success {
            echo 'Build succeeded!'
        }
        failure {
            echo 'Build failed. Please check logs.'
        }
    }
}
