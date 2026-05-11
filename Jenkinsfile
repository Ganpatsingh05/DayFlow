pipeline {
    agent any

    environment {
        IMAGE_NAME = "task-dashboard"
        CONTAINER_NAME = "task-dashboard-container"
    }

    stages {

        stage('Clone Check') {
            steps {
                echo "Code pulled successfully"
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %IMAGE_NAME% .'
            }
        }

        stage('Remove Old Container') {
            steps {
                bat 'docker rm -f %CONTAINER_NAME% || exit 0'
            }
        }

        stage('Run Container') {
            steps {
                bat 'docker run -d -p 8088:80 --name %CONTAINER_NAME% %IMAGE_NAME%'
            }
        }

        stage('Health Check') {
            steps {
                bat 'curl http://localhost:8088'
            }
        }
    }
}