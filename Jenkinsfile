pipeline {
    agent { docker 'node:6.3' }
    stages {
    	stage('Test') {
            steps {
                sh 'node --version'
            }
        }
        stage('build') {
            steps {
                sh 'npm --version'
            }
        }
    }
}
