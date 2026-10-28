pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.64.0-noble'
            args '--ipc=host'
        }
    }

    environment {
        CI = 'true'
        npm_config_cache = "${WORKSPACE}/.npm"
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Test') {
            steps {
                sh 'npx playwright test'
            }
        }
    }

    post {
        always {
            junit allowEmptyResults: true, testResults: 'reports/junit.xml'
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**', allowEmptyArchive: true
        }
    }
}