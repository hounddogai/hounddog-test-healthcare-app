pipeline {
    agent any
    stages {
        stage('Run HoundDog.ai Scan') {
            steps {
                sh '''
                docker run --pull=always --rm -v .:/scanpath hounddogai/scanner:staging \
                    hounddog scan \
                    --output-format=json \
                    --output-filename=hounddog.json \
                    --debug
                '''
                sh 'cat hounddog.json'
            }
        }
    }
}
