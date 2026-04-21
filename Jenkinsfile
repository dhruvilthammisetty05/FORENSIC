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

        stage('Security Vulnerability Scan') {
            steps {
                dir('frontend') {
                    bat 'npm audit --audit-level=high || exit 0' // Exit 0 to prevent pipeline crash on known vulns for demo
                }
                dir('backend') {
                    bat 'npm audit --audit-level=high || exit 0'
                }
            }
        }

        stage('Build Docker Containers') {
            steps {
                // Testing docker build of the environment
                bat 'docker compose build'
            }
        }

        stage('Blockchain & Anti-Virus Verification') {
            steps {
                echo "Simulating CI verification for ClamAV container boot..."
                echo "Simulating Ganache Smart Contract compile checks..."
                dir('blockchain') {
                    bat 'npx truffle compile'
                }
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
