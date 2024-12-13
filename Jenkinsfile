pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                // Clone your Git repository
                git branch: 'main', url: 'https://github.com/RazSherf/Stocker.git'
            }
        }
        stage('Build') {
            steps {
                // Run your build commands
                echo 'Building project...'
            }
        }
        stage('Test') {
            steps {
                // Run your tests
                echo 'Running tests...'
            }
        }
        stage('Deploy') {
            steps {
                // Deploy the application
                echo 'Deploying application...'
            }
        }
    }
}