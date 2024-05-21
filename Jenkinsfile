pipeline {
    agent any
    options {
        ansiColor('xterm')
    }
    stages {
        stage('Run HoundDog.ai Scan') {
            steps {
                sh '''
                docker run --pull=always -v .:/scanpath hounddogai/scanner:staging hounddog scan \
                    --output-format=markdown \
                    --output-filename=results.md
                '''
            }
        }
    }
}
