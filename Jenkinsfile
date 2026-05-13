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
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Remove Old Container') {
            steps {
                sh 'docker rm -f $CONTAINER_NAME || true'
            }
        }

        stage('Run Container') {
            steps {
                sh 'docker run -d -p 8088:80 --name $CONTAINER_NAME $IMAGE_NAME'
            }
        }

        // stage('Health Check') {
        //     steps {
        //         sh 'curl http://localhost:8088'
        //     }
        // }
        stage('Health Check') {
            steps {
                sh '''
                sleep 10
                curl http://host.docker.internal:8088
                '''
            }
        }
    }
}