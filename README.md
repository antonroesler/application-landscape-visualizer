# Application Landscape Visualizer
Summer 2021 group project for the module "Advanced Programming" of the Engineering Business Information Systems B.Sc. program at Frankfurt University of Applied Sciences.

## Contributors
- Anton Roesler
- Patrick Frech
- Leonard Hußke
- Feng Yi Lu

## Rules for Contributors
1. Before a new feature is developed or a change is made, there must be an issue. If there is no issue: open one. The issue is so that everyone else knows what is happening and can comment on it. Everyone should actively participate in the communication.
2. For a new feature, create a new local branch - never work on the main branch. Once the feature is ready and the code works, create a pull request. (See GIT workflow)
3. You should always make sure that your local main branch is synchronized with the original one before creating a new branch.
4. Your code should be cleanly written and commented as needed.
5. Your code should be well tested before creating a pull request.
6. Naming conventions and other style specifications are still to be announced. For JavaScript code, the naming conventions according to https://www.robinwieruch.de/javascript-naming-conventions should be used.

## Best Practices for Contributors
1. To update your local repo, you need to initially use the command `git remote add upstream https://github.com/antonroesler/application-landscape-visualizer`.
To pull the updated repo from the main repo use the command `git pull upstream main` or `git merge upstream main`.
2. Naming rule for a commit is *#issue Here is a short description* e.g. *#1 Initial commit*.
A branch should always contain the feature name and should be descriptive e.g. *test/foo*. Test is a leading token for categorization. More leading tokens are: *feat, bug, test, wip*.

## GIT Workflow
1. Forking the main project.
2. Cloning the forked project to the local machine.
3. Creating a branch to develop a feature, debug, test, ...
4. You then start to work and commit your changes to the new branch.
6. When you're done, make sure the branch is pushed to GitHub and create a pull request to contribute your code to the antonroesler:main.

## JS Header
Before you start coding, create a header comment in the new file you created. It is important to  think about WHAT you are doing before you start coding.

__EXAMPLE__

/*
\* Copyright (c) 2021 Ecore. All rights reserved.\
\*\
\* University:		 Frankfurt University of Applied Sciences\
\* Study program:	 Engineering Business Information Systems\
\* Semester:		   Advanced Programming 20/21\
\* Professor:		   Prof. Dr. Jung, Prof. Dr. Bremm\
\* Date:			     21.04.2021\
\*\
\*/

/**
\* A short description what this file/class is all about.\
\* @author Your full name\
\*\
\*/
