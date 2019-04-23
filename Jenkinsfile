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
        stage('Deploy') {
            steps {
                sh 'node'
            }
        }
    }
    post {
        always {
            echo 'One way or another, I have finished'
        }
        success {
            echo 'I succeeeded!'
        }
        unstable {
            echo 'I am unstable :/'
        }
        failure {
            echo 'I failed :('
        }
        changed {
            echo 'Things were different before...'
        }
    }
}
