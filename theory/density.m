% Current Density
d_c = [1, 3, 5, 3, 1;
       3, 5, 7, 5, 3;
       5, 7, 9, 7, 5;
       3, 5, 7, 5, 3;
       1, 3, 5, 3, 1];

%{
d_c = [0, 0, 0, 0, 0;
       0, 0, 0, 0, 0;
       0, 0, 1, 0, 0;
       0, 0, 0, 0, 0;
       0, 0, 0, 0, 0];
%}

evolution = @(k) [(1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0, -k / 4;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4, 0;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k), -k / 4;
                  0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -k / 4, 0, 0, 0, -k / 4, (1 + k)];


k = 1;

coefficients = evolution(k);

d_c_vector = reshape(d_c, [], 1);

result_vector = inv(coefficients) * d_c_vector;

d_n = reshape(result_vector, 5, 5);

