pipeline {
    agent any

    environment {
        IMAGE_NAME = "task-dashboard"
        CONTAINER_NAME = "task-dashboard-container"
        EC2_HOST = "ec2-35-175-186-96.compute-1.amazonaws.com"
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

        stage('Save Docker Image') {
            steps {
                sh 'docker save -o task-dashboard.tar $IMAGE_NAME'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-key']) {

                    sh '''
                    scp -o StrictHostKeyChecking=no task-dashboard.tar ec2-user@$EC2_HOST:/home/ec2-user/

                    ssh -o StrictHostKeyChecking=no ec2-user@$EC2_HOST "

                    docker load -i task-dashboard.tar

                    docker rm -f $CONTAINER_NAME || true

                    docker run -d -p 8088:80 --name $CONTAINER_NAME $IMAGE_NAME
                    "
                    '''
                }
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                sleep 10
                curl http://$EC2_HOST:8088
                '''
            }
        }
    }
}