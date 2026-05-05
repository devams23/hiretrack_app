pipeline {

    agent any
    
    environment {
        SAFE_BRANCH = "${env.BRANCH_NAME.replaceAll(/[^a-zA-Z0-9]/, '-')}".toLowerCase()
        APP_PORT = "${3000 + Math.abs(SAFE_BRANCH.hashCode() % 1000)}"
        IMAGE_NAME = "hiretrack-${SAFE_BRANCH}"
        

        AZURE_VM_IP = credentials('azure-vm-ip-id')
    }

    stages {
        stage('Cleanup Old Build') {
            steps {
                sh "docker stop ${IMAGE_NAME} || true && docker rm ${IMAGE_NAME} || true"
            }
        }

        stage('Docker Build') {
            steps {

                // Securely inject secrets from Jenkins Credentials Store
                withCredentials([
                    string(credentialsId: 'supabase-url-id', variable: 'S_URL'),
                    string(credentialsId: 'supabase-key-id', variable: 'S_KEY')
                ]) {
                    // CRITICAL: Use SINGLE QUOTES (') for the sh command
                    // This prevents the "insecure interpolation" warning
                    sh 'docker build --build-arg SUPABASE_URL=$S_URL --build-arg SUPABASE_KEY=$S_KEY -t $IMAGE_NAME .'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh "docker run -d --name ${IMAGE_NAME} -p ${APP_PORT}:80 ${IMAGE_NAME}"
            }
        }
    }

    post {

        success {
            withCredentials([usernamePassword(credentialsId: 'hiretrack-app', passwordVariable: 'G_TOKEN')]) {

                sh '''
                    curl -H "Authorization: token $G_TOKEN" \
                        -X POST \
                        -d "{\\"body\\": \\"🚀 Feature Deployed! Access it here: http://${VM_IP}:${APP_PORT}\\"}" \
                        "https://api.github.com/repos/devams23/hiretrack_app/issues/${CHANGE_ID}/comments"
                '''
            }   
        }


    }
}
